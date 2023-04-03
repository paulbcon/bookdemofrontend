package com.perscholas.bookdemo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.perscholas.bookdemo.model.Book;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByTitleContainingIgnoreCase(String title);
}
