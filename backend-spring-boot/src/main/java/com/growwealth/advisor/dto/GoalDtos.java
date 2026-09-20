package com.growwealth.advisor.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class GoalDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InvestmentGoalDto {
        private String id;
        private String title;
        private String description;

        @JsonProperty("icon_data")
        private String iconData;

        @JsonProperty("color_hex")
        private String colorHex;

        @JsonProperty("category_ids")
        private List<String> categoryIds;
    }
}
