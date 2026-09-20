package com.growwealth.advisor.repository;

import com.growwealth.advisor.entity.ContentItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentItemRepository extends JpaRepository<ContentItem, String> {
    List<ContentItem> findByTypeOrderByCreatedAtDesc(String type);
}
