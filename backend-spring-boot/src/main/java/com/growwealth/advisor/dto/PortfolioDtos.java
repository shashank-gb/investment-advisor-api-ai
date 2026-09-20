package com.growwealth.advisor.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

public class PortfolioDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PortfolioSummaryDto {
        @JsonProperty("total_invested")
        private Double totalInvested;

        @JsonProperty("current_value")
        private Double currentValue;

        @JsonProperty("total_returns")
        private Double totalReturns;

        @JsonProperty("returns_percent")
        private Double returnsPercent;

        private Double xirr;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PortfolioHoldingDto {
        @JsonProperty("fund_id")
        private String fundId;

        @JsonProperty("fund_name")
        private String fundName;

        private String amc;

        private Double units;

        @JsonProperty("invested_amount")
        private Double investedAmount;

        @JsonProperty("current_value")
        private Double currentValue;

        private Double returns;

        @JsonProperty("returns_percent")
        private Double returnsPercent;

        @JsonProperty("folio_number")
        private String folioNumber;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InvestRequest {
        @NotBlank(message = "Fund ID is required")
        @JsonProperty("fund_id")
        private String fundId;

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "100.0", message = "Minimum investment is Rs. 100")
        private BigDecimal amount;

        @JsonProperty("folio_number")
        private String folioNumber;
    }
}
