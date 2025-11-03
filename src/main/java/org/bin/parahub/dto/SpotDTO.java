package org.bin.parahub.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

/**
 * @author VeagleV
 * @version 0.1
 * @see org.bin.parahub.entity.Spot
 * @see org.bin.parahub.mapper.SpotMapper
 * DTO для Spot, чтобы инкапсулировать фронт от самой сущности
 */
@Data
public class SpotDTO {

    private Long id;

    private Boolean isEnabled = true;


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

    @Size(max = 2048)
    private String description;

    private String suitableWinds;

    @Min(value = 1)
    @Max(value = 5)
    private Integer xcDifficulty;

    @Min(value = 1)
    @Max(value = 5)
    private Integer learningDifficulty;

    @Min(value = 1)
    @Max(value = 5)
    private Integer popularity;

    private String bestSeason;

    private String accessibility;

    private List<TerrainPointDTO> terrainPoints;
}
