package com.growwealth.advisor.repository;

import com.growwealth.advisor.entity.MutualFund;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface MutualFundRepository extends JpaRepository<MutualFund, String> {

    List<MutualFund> findByCategoryIgnoreCaseOrderByReturns1YDesc(String category, Pageable pageable);

    List<MutualFund> findAllByOrderByReturns1YDesc(Pageable pageable);

    @Query("SELECT m FROM MutualFund m WHERE " +
           "LOWER(m.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.amc) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.category) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<MutualFund> searchFunds(@Param("query") String query, Pageable pageable);

    @Query("SELECT m FROM MutualFund m WHERE m.category IN :categories ORDER BY m.returns1Y DESC")
    List<MutualFund> findByCategories(@Param("categories") Collection<String> categories);
}
