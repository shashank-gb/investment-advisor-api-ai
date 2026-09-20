package com.growwealth.advisor.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "investment_goals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvestmentGoal {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon_data", nullable = false, length = 100)
    private String iconData;

    @Column(name = "color_hex", nullable = false, length = 30)
    private String colorHex;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "goal_categories", joinColumns = @JoinColumn(name = "goal_id"))
    @Column(name = "category_id")
    @Builder.Default
    private Set<String> categoryIds = new HashSet<>();
}
