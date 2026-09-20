package com.growwealth.advisor.repository;

import com.growwealth.advisor.entity.User;
import com.growwealth.advisor.entity.WatchlistGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WatchlistGroupRepository extends JpaRepository<WatchlistGroup, String> {
    List<WatchlistGroup> findByUserOrderByCreatedAtAsc(User user);
}
