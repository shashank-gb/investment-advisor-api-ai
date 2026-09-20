package com.growwealth.advisor.service;

import com.growwealth.advisor.dto.FundDtos.*;
import com.growwealth.advisor.entity.FundCategory;
import com.growwealth.advisor.entity.FundDetail;
import com.growwealth.advisor.entity.FundHolding;
import com.growwealth.advisor.entity.MutualFund;
import com.growwealth.advisor.exception.ResourceNotFoundException;
import com.growwealth.advisor.repository.FundCategoryRepository;
import com.growwealth.advisor.repository.FundDetailRepository;
import com.growwealth.advisor.repository.InvestmentGoalRepository;
import com.growwealth.advisor.repository.MutualFundRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class FundService {

    private final FundCategoryRepository categoryRepository;
    private final MutualFundRepository fundRepository;
    private final FundDetailRepository detailRepository;
    private final InvestmentGoalRepository goalRepository;

    public FundService(
            FundCategoryRepository categoryRepository,
            MutualFundRepository fundRepository,
            FundDetailRepository detailRepository,
            InvestmentGoalRepository goalRepository) {
        this.categoryRepository = categoryRepository;
        this.fundRepository = fundRepository;
        this.detailRepository = detailRepository;
        this.goalRepository = goalRepository;
    }

    public List<FundCategoryDto> getCategories() {
        return categoryRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(this::mapCategoryToDto)
                .collect(Collectors.toList());
    }

    public List<MutualFundDto> getTopFunds(String category, Integer limit) {
        int pageLimit = (limit != null && limit > 0) ? limit : 10;
        PageRequest pageRequest = PageRequest.of(0, pageLimit);

        List<MutualFund> funds;
        if (category != null && !category.isBlank() && !"all".equalsIgnoreCase(category)) {
            funds = fundRepository.findByCategoryIgnoreCaseOrderByReturns1YDesc(category.trim(), pageRequest);
        } else {
            funds = fundRepository.findAllByOrderByReturns1YDesc(pageRequest);
        }

        return funds.stream().map(this::mapFundToDto).collect(Collectors.toList());
    }

    public FundDetailDto getFundDetail(String fundId) {
        MutualFund fund = fundRepository.findById(fundId)
                .orElseThrow(() -> new ResourceNotFoundException("Mutual fund not found with ID: " + fundId));

        FundDetail detail = detailRepository.findById(fundId).orElse(null);

        List<HoldingDto> holdings;
        if (fund.getHoldings() != null && !fund.getHoldings().isEmpty()) {
            holdings = fund.getHoldings().stream()
                    .map(h -> HoldingDto.builder()
                            .name(h.getName())
                            .companyName(h.getCompanyName())
                            .weightage(h.getWeightage().doubleValue())
                            .logoUrl(null)
                            .build())
                    .collect(Collectors.toList());
        } else {
            // Default top holdings
            holdings = List.of(
                    HoldingDto.builder().name("HDFC Bank Ltd").companyName("Financials").weightage(9.5).logoUrl(null).build(),
                    HoldingDto.builder().name("ICICI Bank Ltd").companyName("Financials").weightage(8.2).logoUrl(null).build(),
                    HoldingDto.builder().name("Reliance Industries").companyName("Energy").weightage(7.1).logoUrl(null).build(),
                    HoldingDto.builder().name("Infosys Ltd").companyName("Technology").weightage(5.4).logoUrl(null).build(),
                    HoldingDto.builder().name("TCS").companyName("Technology").weightage(4.8).logoUrl(null).build()
            );
        }

        List<ChartPointDto> chartPoints;
        if (fund.getNavHistory() != null && !fund.getNavHistory().isEmpty()) {
            chartPoints = fund.getNavHistory().stream()
                    .map(nh -> ChartPointDto.builder()
                            .date(nh.getNavDate().toString())
                            .value(nh.getNavValue().doubleValue())
                            .build())
                    .collect(Collectors.toList());
        } else {
            chartPoints = generateSyntheticChart(fund.getNav().doubleValue());
        }

        return FundDetailDto.builder()
                .fund(mapFundToDto(fund))
                .aum(detail != null ? detail.getAum() : "24,100 Cr")
                .expenseRatio(detail != null ? detail.getExpenseRatio() : "1.10%")
                .exitLoad(detail != null ? detail.getExitLoad() : "1.0% if redeemed before 1 year.")
                .minSip(detail != null ? detail.getMinSip() : "100")
                .holdings(holdings)
                .performanceChart(chartPoints)
                .build();
    }

    public List<MutualFundDto> searchFunds(String query, Integer limit) {
        if (query == null || query.trim().length() < 2) {
            return List.of();
        }
        int pageLimit = (limit != null && limit > 0) ? limit : 20;
        return fundRepository.searchFunds(query.trim(), PageRequest.of(0, pageLimit)).stream()
                .map(this::mapFundToDto)
                .collect(Collectors.toList());
    }

    public List<MutualFundDto> getGoalFunds(String goalId, String riskProfile) {
        var goalOpt = goalRepository.findById(goalId);
        List<MutualFund> funds;
        if (goalOpt.isPresent() && !goalOpt.get().getCategoryIds().isEmpty()) {
            funds = fundRepository.findByCategories(goalOpt.get().getCategoryIds());
        } else {
            funds = fundRepository.findAll();
        }

        if (riskProfile != null && !riskProfile.isBlank()) {
            String r = riskProfile.toLowerCase();
            if (r.contains("low")) {
                funds = funds.stream()
                        .filter(f -> f.getRiskLevel().toLowerCase().contains("low") || "debt".equalsIgnoreCase(f.getCategory()))
                        .collect(Collectors.toList());
            } else if (r.contains("mod")) {
                funds = funds.stream()
                        .filter(f -> f.getRiskLevel().toLowerCase().contains("moderate") || "hybrid".equalsIgnoreCase(f.getCategory()))
                        .collect(Collectors.toList());
            } else if (r.contains("high")) {
                funds = funds.stream()
                        .filter(f -> f.getRiskLevel().toLowerCase().contains("high") || "equity".equalsIgnoreCase(f.getCategory()))
                        .collect(Collectors.toList());
            }
        }

        return funds.stream().map(this::mapFundToDto).collect(Collectors.toList());
    }

    public MutualFundDto mapFundToDto(MutualFund fund) {
        String isin = "INF" + fund.getId().replace("-", "").replace("_", "").toUpperCase();
        if (isin.length() > 12) {
            isin = isin.substring(0, 12);
        }

        return MutualFundDto.builder()
                .id(fund.getId())
                .name(fund.getName())
                .amc(fund.getAmc())
                .category(fund.getCategory())
                .nav(fund.getNav().doubleValue())
                .returns1Y(fund.getReturns1Y().doubleValue())
                .returns3Y(fund.getReturns3Y() != null ? fund.getReturns3Y().doubleValue() : null)
                .riskLevel(fund.getRiskLevel())
                .minInvestment(fund.getMinInvestment().doubleValue())
                .isin(isin)
                .build();
    }

    public FundCategoryDto mapCategoryToDto(FundCategory category) {
        return FundCategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }

    private List<ChartPointDto> generateSyntheticChart(double baseNav) {
        List<ChartPointDto> points = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = 29; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            double val = baseNav - (i * 0.45) + (i % 4 == 0 ? 1.5 : -0.8);
            points.add(ChartPointDto.builder()
                    .date(date.toString())
                    .value(Math.round(val * 100.0) / 100.0)
                    .build());
        }
        return points;
    }
}
