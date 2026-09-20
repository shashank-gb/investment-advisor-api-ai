package com.growwealth.advisor.controller;

import com.growwealth.advisor.dto.ApiResponse;
import com.growwealth.advisor.dto.ContentDtos.*;
import com.growwealth.advisor.service.ContentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping({"/api/v1", ""})
@Tag(name = "Content & Market Feeds", description = "Educational blogs, promotional advisories, and live market index feeds")
public class ContentController {

    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping({"/content/blogs", "/blogs"})
    @Operation(summary = "Get educational blogs", description = "Retrieves investment guides, SIP tutorials, and tax saving articles")
    public ResponseEntity<ApiResponse<List<ContentItemDto>>> getBlogs() {
        return ResponseEntity.ok(ApiResponse.of(contentService.getBlogs()));
    }

    @GetMapping({"/content/ads", "/ads"})
    @Operation(summary = "Get banners and advisories", description = "Retrieves promo banners for SIP and goal planning")
    public ResponseEntity<ApiResponse<List<ContentItemDto>>> getAds() {
        return ResponseEntity.ok(ApiResponse.of(contentService.getAds()));
    }

    @GetMapping({"/market/indexes", "/market"})
    @Operation(summary = "Get market indices", description = "Provides NIFTY 50, SENSEX, and NIFTY BANK benchmark index snapshots")
    public ResponseEntity<ApiResponse<List<MarketIndexDto>>> getMarketIndexes() {
        return ResponseEntity.ok(ApiResponse.of(contentService.getMarketIndexes()));
    }

    @GetMapping({"/config/design", "/config"})
    @Operation(summary = "Get remote app design config", description = "Dynamic theme colors and client-side feature toggles")
    public ResponseEntity<AppDesignConfigDto> getAppDesign() {
        return ResponseEntity.ok(contentService.getAppDesign());
    }
}
