package com.example.model.paging;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Sort;

public class PagingUtil {

  public static List<Sort.Order> createSortOrder(List<String> sortList, Sort.Direction sortDirection) {
    List<Sort.Order> sorts = new ArrayList<>();
    for (String sort : sortList) {
      sorts.add(new Sort.Order(sortDirection, sort));
    }
    return sorts;
  }
}
