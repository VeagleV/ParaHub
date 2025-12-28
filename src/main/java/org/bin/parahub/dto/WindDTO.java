package org.bin.parahub.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.bin.parahub.enums.WindDirection;

@Data
public class WindDTO {
    
    private Long id;
    
    @NotNull(message = "Направление ветра обязательно")
    private WindDirection direction;
    
    @NotNull(message = "Минимальная скорость обязательна")
    @Min(value = 0, message = "Минимальная скорость не может быть отрицательной")
    @Max(value = 50, message = "Минимальная скорость не может превышать 50 м/с")
    private Integer minSpeed;
    
    @NotNull(message = "Максимальная скорость обязательна")
    @Min(value = 0, message = "Максимальная скорость не может быть отрицательной")
    @Max(value = 50, message = "Максимальная скорость не может превышать 50 м/с")
    private Integer maxSpeed;
    
    private Long spotId;
    
    @AssertTrue(message = "Максимальная скорость должна быть больше или равна минимальной")
    private boolean isMaxSpeedValid() {
        if (minSpeed == null || maxSpeed == null) {
            return true; // Let @NotNull handle null validation
        }
        return maxSpeed >= minSpeed;
    }
}
