package com.growwealth.advisor.repository;

import com.growwealth.advisor.entity.MutualFund;
import com.growwealth.advisor.entity.WatchlistFund;
import com.growwealth.advisor.entity.WatchlistGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchlistFundRepository extends JpaRepository<WatchlistFund, String> {
    List<WatchlistFund> findByGroupOrderByCreatedAtDesc(WatchlistGroup group);
    int countByGroup(WatchlistGroup group);
    Optional<WatchlistFund> findByGroupAndFund(WatchlistGroup group, MutualFund fund);
}
