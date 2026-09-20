package com.growwealth.advisor.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class WatchlistDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WatchlistGroupDto {
        private String id;
        private String name;

        @JsonProperty("fund_count")
        private Integer fundCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WatchlistFundDto {
        @JsonProperty("group_id")
        private String groupId;

        private FundDtos.MutualFundDto fund;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateWatchlistGroupRequest {
        @NotBlank(message = "Group name is required")
        private String name;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddWatchlistFundRequest {
        @NotBlank(message = "Group ID is required")
        @JsonProperty("group_id")
        private String groupId;

        @NotBlank(message = "Fund ID is required")
        @JsonProperty("fund_id")
        private String fundId;
    }
}
