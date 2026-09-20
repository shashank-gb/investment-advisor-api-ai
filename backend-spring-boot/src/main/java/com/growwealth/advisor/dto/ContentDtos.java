package com.growwealth.advisor.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

public class ContentDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContentItemDto {
        private String id;
        private String title;
        private String subtitle;

        @JsonProperty("image_url")
        private String imageUrl;

        @JsonProperty("action_url")
        private String actionUrl;

        private String type;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MarketIndexDto {
        @JsonProperty("indexName")
        private String indexName;

        private Double last;

        @JsonProperty("previousClose")
        private Double previousClose;

        @JsonProperty("percChange")
        private Double percChange;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AppDesignConfigDto {
        private String primaryColor;
        private String secondaryColor;
        private String themeMode;
        private Map<String, Object> featureFlags;
    }
}
