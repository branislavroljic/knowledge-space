package com.example.model.paging;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PageResponse<T> {
  private List<T> rows;
  private long totalCount;
}
