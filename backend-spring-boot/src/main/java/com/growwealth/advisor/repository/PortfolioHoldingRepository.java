package com.growwealth.advisor.repository;

import com.growwealth.advisor.entity.PortfolioHolding;
import com.growwealth.advisor.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortfolioHoldingRepository extends JpaRepository<PortfolioHolding, String> {
    List<PortfolioHolding> findByUserOrderByCreatedAtDesc(User user);
}
