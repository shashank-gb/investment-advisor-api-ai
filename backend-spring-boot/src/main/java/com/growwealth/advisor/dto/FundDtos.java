package com.growwealth.advisor.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

public class FundDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FundCategoryDto {
        private String id;
        private String name;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MutualFundDto {
        private String id;
        private String name;
        private String amc;
        private String category;
        private Double nav;

        @JsonProperty("returns_1y")
        @JsonAlias({"returns_1y", "returns1Y"})
        private Double returns1Y;

        @JsonProperty("returns_3y")
        @JsonAlias({"returns_3y", "returns3Y"})
        private Double returns3Y;

        @JsonProperty("risk_level")
        @JsonAlias({"risk_level", "riskLevel"})
        private String riskLevel;

        @JsonProperty("min_investment")
        @JsonAlias({"min_investment", "minInvestment"})
        private Double minInvestment;

        private String isin;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HoldingDto {
        private String name;

        @JsonProperty("company_name")
        @JsonAlias({"company_name", "companyName"})
        private String companyName;

        private Double weightage;

        @JsonProperty("logo_url")
        private String logoUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChartPointDto {
        private String date;
        private Double value;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FundDetailDto {
        private MutualFundDto fund;
        private String aum;

        @JsonProperty("expense_ratio")
        @JsonAlias({"expense_ratio", "expenseRatio"})
        private String expenseRatio;

        @JsonProperty("exit_load")
        @JsonAlias({"exit_load", "exitLoad"})
        private String exitLoad;

        @JsonProperty("min_sip")
        @JsonAlias({"min_sip", "minSip"})
        private String minSip;

        private List<HoldingDto> holdings;

        @JsonProperty("performance_chart")
        @JsonAlias({"performance_chart", "performanceChart"})
        private List<ChartPointDto> performanceChart;
    }
}
