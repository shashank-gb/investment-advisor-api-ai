package com.growwealth.advisor.service;

import com.growwealth.advisor.dto.ContentDtos.*;
import com.growwealth.advisor.entity.ContentItem;
import com.growwealth.advisor.repository.ContentItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ContentService {

    private final ContentItemRepository contentItemRepository;

    public ContentService(ContentItemRepository contentItemRepository) {
        this.contentItemRepository = contentItemRepository;
    }

    public List<ContentItemDto> getBlogs() {
        return contentItemRepository.findByTypeOrderByCreatedAtDesc("blog").stream()
                .map(this::mapContentToDto)
                .collect(Collectors.toList());
    }

    public List<ContentItemDto> getAds() {
        return contentItemRepository.findByTypeOrderByCreatedAtDesc("ad").stream()
                .map(this::mapContentToDto)
                .collect(Collectors.toList());
    }

    public List<MarketIndexDto> getMarketIndexes() {
        return List.of(
                MarketIndexDto.builder()
                        .indexName("NIFTY 50")
                        .last(24150.70)
                        .previousClose(24025.40)
                        .percChange(0.52)
                        .build(),
                MarketIndexDto.builder()
                        .indexName("SENSEX")
                        .last(79842.20)
                        .previousClose(79430.05)
                        .percChange(0.52)
                        .build(),
                MarketIndexDto.builder()
                        .indexName("NIFTY BANK")
                        .last(51230.45)
                        .previousClose(51319.65)
                        .percChange(-0.17)
                        .build()
        );
    }

    public AppDesignConfigDto getAppDesign() {
        return AppDesignConfigDto.builder()
                .primaryColor("#1A237E")
                .secondaryColor("#0D47A1")
                .themeMode("system")
                .featureFlags(Map.of(
                        "enableKycUpload", true,
                        "enableGoalPlanning", true,
                        "enableSipCalculator", true,
                        "enableDirectAmcLinks", true
                ))
                .build();
    }

    private ContentItemDto mapContentToDto(ContentItem item) {
        return ContentItemDto.builder()
                .id(item.getId())
                .title(item.getTitle())
                .subtitle(item.getSubtitle())
                .imageUrl(item.getImageUrl())
                .actionUrl(item.getActionUrl())
                .type(item.getType())
                .build();
    }
}
