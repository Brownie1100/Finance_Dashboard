package com.financedashboard.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "ExpenseTracker")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long userId;
    private String category;
    private Double amount;
    private LocalDate date;
    private String description;

    public Expense() {}

    public Expense(Long userId, String category, Double amount, LocalDate date, String description) {
        this.userId=userId;
        this.category = category;
        this.amount = amount;
        this.date = date;
        this.description = description;
    }

    @Override
    public String toString() {
        return "Expense [UserId=" + userId + ", category=" + category + ", amount=" + amount + ", date=" + date + "description=" + description + "]";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}