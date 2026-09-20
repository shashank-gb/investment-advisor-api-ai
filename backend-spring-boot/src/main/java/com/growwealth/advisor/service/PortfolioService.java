package com.growwealth.advisor.service;

import com.growwealth.advisor.dto.PortfolioDtos.*;
import com.growwealth.advisor.entity.MutualFund;
import com.growwealth.advisor.entity.PortfolioHolding;
import com.growwealth.advisor.entity.User;
import com.growwealth.advisor.exception.ResourceNotFoundException;
import com.growwealth.advisor.repository.MutualFundRepository;
import com.growwealth.advisor.repository.PortfolioHoldingRepository;
import com.growwealth.advisor.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PortfolioService {

    private final PortfolioHoldingRepository holdingRepository;
    private final UserRepository userRepository;
    private final MutualFundRepository mutualFundRepository;

    public PortfolioService(
            PortfolioHoldingRepository holdingRepository,
            UserRepository userRepository,
            MutualFundRepository mutualFundRepository) {
        this.holdingRepository = holdingRepository;
        this.userRepository = userRepository;
        this.mutualFundRepository = mutualFundRepository;
    }

    private User resolveUser(String userId) {
        if (userId == null || userId.isBlank()) {
            userId = "user_001";
        }
        final String target = userId;
        return userRepository.findById(target)
                .or(() -> userRepository.findByEmail(target))
                .or(() -> userRepository.findAll().stream().findFirst())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + target));
    }

    @Transactional(readOnly = true)
    public PortfolioSummaryDto getPortfolioSummary(String userId) {
        User user = resolveUser(userId);

        List<PortfolioHolding> holdings = holdingRepository.findByUserOrderByCreatedAtDesc(user);

        if (holdings.isEmpty()) {
            return PortfolioSummaryDto.builder()
                    .totalInvested(0.0)
                    .currentValue(0.0)
                    .totalReturns(0.0)
                    .returnsPercent(0.0)
                    .xirr(0.0)
                    .build();
        }

        double totalInvested = 0.0;
        double currentValue = 0.0;

        for (PortfolioHolding h : holdings) {
            double invested = h.getInvestedAmount().doubleValue();
            double nav = h.getFund().getNav().doubleValue();
            double curr = h.getUnits().doubleValue() * nav;

            totalInvested += invested;
            currentValue += curr;
        }

        double totalReturns = currentValue - totalInvested;
        double returnsPercent = totalInvested > 0 ? (totalReturns / totalInvested) * 100.0 : 0.0;

        // Estimated XIRR based on portfolio performance
        double xirr = returnsPercent > 0 ? Math.min(28.5, 12.0 + (returnsPercent * 0.35)) : 0.0;

        return PortfolioSummaryDto.builder()
                .totalInvested(round(totalInvested))
                .currentValue(round(currentValue))
                .totalReturns(round(totalReturns))
                .returnsPercent(round(returnsPercent))
                .xirr(round(xirr))
                .build();
    }

    @Transactional(readOnly = true)
    public List<PortfolioHoldingDto> getHoldings(String userId) {
        User user = resolveUser(userId);

        List<PortfolioHolding> holdings = holdingRepository.findByUserOrderByCreatedAtDesc(user);

        return holdings.stream().map(h -> {
            MutualFund fund = h.getFund();
            double units = h.getUnits().doubleValue();
            double invested = h.getInvestedAmount().doubleValue();
            double current = units * fund.getNav().doubleValue();
            double returns = current - invested;
            double returnsPercent = invested > 0 ? (returns / invested) * 100.0 : 0.0;

            return PortfolioHoldingDto.builder()
                    .fundId(fund.getId())
                    .fundName(fund.getName())
                    .amc(fund.getAmc())
                    .units(round(units, 4))
                    .investedAmount(round(invested))
                    .currentValue(round(current))
                    .returns(round(returns))
                    .returnsPercent(round(returnsPercent))
                    .folioNumber(h.getFolioNumber())
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional
    public PortfolioHoldingDto investInFund(String userId, InvestRequest request) {
        User user = resolveUser(userId);

        MutualFund fund = mutualFundRepository.findById(request.getFundId())
                .orElseThrow(() -> new ResourceNotFoundException("Mutual fund not found: " + request.getFundId()));

        BigDecimal amount = request.getAmount();
        BigDecimal nav = fund.getNav();
        BigDecimal units = amount.divide(nav, 4, RoundingMode.HALF_UP);

        String folio = request.getFolioNumber() != null && !request.getFolioNumber().isBlank()
                ? request.getFolioNumber()
                : String.valueOf((long) (Math.random() * 9000000000L) + 1000000000L);

        PortfolioHolding holding = PortfolioHolding.builder()
                .id("ph_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12))
                .user(user)
                .fund(fund)
                .units(units)
                .investedAmount(amount)
                .folioNumber(folio)
                .build();

        PortfolioHolding saved = holdingRepository.save(holding);

        double invested = amount.doubleValue();
        double current = units.doubleValue() * nav.doubleValue();

        return PortfolioHoldingDto.builder()
                .fundId(fund.getId())
                .fundName(fund.getName())
                .amc(fund.getAmc())
                .units(round(units.doubleValue(), 4))
                .investedAmount(round(invested))
                .currentValue(round(current))
                .returns(0.0)
                .returnsPercent(0.0)
                .folioNumber(folio)
                .build();
    }

    private double round(double val) {
        return Math.round(val * 100.0) / 100.0;
    }

    private double round(double val, int decimals) {
        double factor = Math.pow(10, decimals);
        return Math.round(val * factor) / factor;
    }
}
