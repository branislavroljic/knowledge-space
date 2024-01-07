package api.model.paging;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageInfoRequest {

  private Integer pageIndex = 0;
  private Integer pageSize = 10;
  private boolean showDeleted = false;
  private String sortBy = "id";
  private Sort.Direction sortDirection = Direction.ASC;
}
