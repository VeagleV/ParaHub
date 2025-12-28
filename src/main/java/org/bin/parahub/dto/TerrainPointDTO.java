package org.bin.parahub.dto;


import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.ToString;
import org.bin.parahub.enums.PointType;


@Data
@ToString
public class TerrainPointDTO {


    private Long id;

    private Boolean isEnabled;

    @NotBlank(message = "название не может быть пустым")
    private String name;

    @NotNull(message = "широта обязательна")
    @Max(value = 90, message =  "широта не может быть больше 90")
    @Min(value = -90, message =  "широта не может быть меньше -90")
    private Double latitude;

    @NotNull(message = "долгота обязательна")
    @Max(value = 180, message =  "долгота не может быть больше 180")
    @Min(value = -180, message =  "долгота не может быть меньше -180")
    private Double longitude;

    @NotNull(message = "высота обязательна")
    @Min(value = 0, message = "Высота не может быть отрицательной")
    private Double elevation;

    private PointType type;


    @Size(max = 2048)
    private String description;

    private Long spotId;

}
