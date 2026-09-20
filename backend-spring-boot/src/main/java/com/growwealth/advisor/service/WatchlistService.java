package com.growwealth.advisor.service;

import com.growwealth.advisor.dto.FundDtos.MutualFundDto;
import com.growwealth.advisor.dto.WatchlistDtos.*;
import com.growwealth.advisor.entity.MutualFund;
import com.growwealth.advisor.entity.User;
import com.growwealth.advisor.entity.WatchlistFund;
import com.growwealth.advisor.entity.WatchlistGroup;
import com.growwealth.advisor.exception.ApiException;
import com.growwealth.advisor.exception.ResourceNotFoundException;
import com.growwealth.advisor.repository.MutualFundRepository;
import com.growwealth.advisor.repository.UserRepository;
import com.growwealth.advisor.repository.WatchlistFundRepository;
import com.growwealth.advisor.repository.WatchlistGroupRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class WatchlistService {

    private final WatchlistGroupRepository groupRepository;
    private final WatchlistFundRepository fundRepository;
    private final UserRepository userRepository;
    private final MutualFundRepository mutualFundRepository;
    private final FundService fundService;

    public WatchlistService(
            WatchlistGroupRepository groupRepository,
            WatchlistFundRepository fundRepository,
            UserRepository userRepository,
            MutualFundRepository mutualFundRepository,
            FundService fundService) {
        this.groupRepository = groupRepository;
        this.fundRepository = fundRepository;
        this.userRepository = userRepository;
        this.mutualFundRepository = mutualFundRepository;
        this.fundService = fundService;
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
    public List<WatchlistGroupDto> getGroups(String userId) {
        User user = resolveUser(userId);

        List<WatchlistGroup> groups = groupRepository.findByUserOrderByCreatedAtAsc(user);

        return groups.stream().map(g -> WatchlistGroupDto.builder()
                .id(g.getId())
                .name(g.getName())
                .fundCount(fundRepository.countByGroup(g))
                .build()
        ).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<WatchlistFundDto> getFundsForGroup(String userId, String groupId) {
        User user = resolveUser(userId);

        if (groupId == null || groupId.isBlank()) {
            List<WatchlistGroup> userGroups = groupRepository.findByUserOrderByCreatedAtAsc(user);
            return userGroups.stream()
                    .flatMap(g -> fundRepository.findByGroupOrderByCreatedAtDesc(g).stream()
                            .map(wf -> WatchlistFundDto.builder()
                                    .groupId(g.getId())
                                    .fund(fundService.mapFundToDto(wf.getFund()))
                                    .build()))
                    .collect(Collectors.toList());
        }

        WatchlistGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Watchlist group not found: " + groupId));

        if (!group.getUser().getId().equals(user.getId())) {
            throw new ApiException("Access denied to this watchlist group", HttpStatus.FORBIDDEN, "FORBIDDEN");
        }

        List<WatchlistFund> list = fundRepository.findByGroupOrderByCreatedAtDesc(group);

        return list.stream().map(wf -> WatchlistFundDto.builder()
                .groupId(groupId)
                .fund(fundService.mapFundToDto(wf.getFund()))
                .build()
        ).collect(Collectors.toList());
    }

    @Transactional
    public WatchlistGroupDto createGroup(String userId, CreateWatchlistGroupRequest request) {
        User user = resolveUser(userId);

        WatchlistGroup group = WatchlistGroup.builder()
                .id("wl_" + UUID.randomUUID().toString().replace("-", "").substring(0, 10))
                .user(user)
                .name(request.getName().trim())
                .build();

        WatchlistGroup saved = groupRepository.save(group);

        return WatchlistGroupDto.builder()
                .id(saved.getId())
                .name(saved.getName())
                .fundCount(0)
                .build();
    }

    @Transactional
    public WatchlistFundDto addFundToGroup(String userId, AddWatchlistFundRequest request) {
        User user = resolveUser(userId);

        WatchlistGroup group = groupRepository.findById(request.getGroupId())
                .orElseThrow(() -> new ResourceNotFoundException("Watchlist group not found: " + request.getGroupId()));

        if (!group.getUser().getId().equals(user.getId())) {
            throw new ApiException("Access denied to this watchlist group", HttpStatus.FORBIDDEN, "FORBIDDEN");
        }

        MutualFund fund = mutualFundRepository.findById(request.getFundId())
                .orElseThrow(() -> new ResourceNotFoundException("Mutual fund not found: " + request.getFundId()));

        if (fundRepository.findByGroupAndFund(group, fund).isPresent()) {
            return WatchlistFundDto.builder()
                    .groupId(group.getId())
                    .fund(fundService.mapFundToDto(fund))
                    .build();
        }

        WatchlistFund wf = WatchlistFund.builder()
                .id("wlf_" + UUID.randomUUID().toString().replace("-", "").substring(0, 10))
                .group(group)
                .fund(fund)
                .build();

        fundRepository.save(wf);

        return WatchlistFundDto.builder()
                .groupId(group.getId())
                .fund(fundService.mapFundToDto(fund))
                .build();
    }

    @Transactional
    public void removeFundFromGroup(String userId, String groupId, String fundId) {
        User user = resolveUser(userId);

        WatchlistGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Watchlist group not found: " + groupId));

        if (!group.getUser().getId().equals(user.getId())) {
            throw new ApiException("Access denied to this watchlist group", HttpStatus.FORBIDDEN, "FORBIDDEN");
        }

        MutualFund fund = mutualFundRepository.findById(fundId)
                .orElseThrow(() -> new ResourceNotFoundException("Mutual fund not found: " + fundId));

        fundRepository.findByGroupAndFund(group, fund).ifPresent(fundRepository::delete);
    }
}
