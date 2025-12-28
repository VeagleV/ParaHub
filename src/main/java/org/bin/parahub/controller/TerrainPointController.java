package org.bin.parahub.controller;


import jakarta.validation.Valid;
import org.bin.parahub.annotation.Profiled;
import org.bin.parahub.dto.TerrainPointDTO;
import org.bin.parahub.entity.TerrainPoint;
import org.bin.parahub.service.TerrainPointService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/terrain_points")
@Profiled(logArgs = true, logResult = false)
public class TerrainPointController {

    private final TerrainPointService terrainPointService;

    public TerrainPointController(TerrainPointService terrainPointService) { this.terrainPointService = terrainPointService; }

    @GetMapping
    public ResponseEntity<List<TerrainPointDTO>> getAllTerrainPoints() {
        List<TerrainPointDTO> terrainPointDTOs = terrainPointService.getAllTerrainPoints();

        return ResponseEntity.status(HttpStatus.OK).body(terrainPointDTOs);
    }

    @GetMapping("/spotID/{spotID}")
    public ResponseEntity<List<TerrainPointDTO>> getAllTerrainPointsBySpotID(@PathVariable long spotID) {
        List<TerrainPointDTO> terrainPointDTOS = terrainPointService.getAllTerrainPointsBySpotID(spotID);

        return ResponseEntity.status(HttpStatus.OK).body(terrainPointDTOS);
    }

    @GetMapping("/spotName/{spotName}")
    public ResponseEntity<List<TerrainPointDTO>> getAllTerrainPointsBySpotName(@PathVariable String spotName) {
        List<TerrainPointDTO> terrainPointDTOS = terrainPointService.getAllTerrainPointsBySpotName(spotName);

        return ResponseEntity.status(HttpStatus.OK).body(terrainPointDTOS);
    }

    @PostMapping
    public ResponseEntity<TerrainPointDTO> createTerrainPoint(@Valid @RequestBody TerrainPointDTO terrainPointDTO){
        TerrainPointDTO saved = terrainPointService.save(terrainPointDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/spotName/{spotName}")
    public ResponseEntity<TerrainPointDTO> createTerrainPointInSpot(@Valid @RequestBody TerrainPointDTO terrainPointDTO, @PathVariable String spotName){
        TerrainPointDTO saved = terrainPointService.saveWithSpotName(terrainPointDTO, spotName);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/spotID/{spotID}")
    public ResponseEntity<TerrainPointDTO> createTerrainPointInSpotID(@Valid @RequestBody TerrainPointDTO terrainPointDTO, @PathVariable long spotID){
        TerrainPointDTO saved = terrainPointService.saveWithSpotID(terrainPointDTO, spotID);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<Void> deleteTerrainPoint(@PathVariable Long id){
        terrainPointService.deleteTerrainPointByID(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping("/spotID/{spotID}")
    public ResponseEntity<Void> deleteTerrainPointsBySpotID(@PathVariable long spotID){
        terrainPointService.deleteTerrainPointsBySpotID(spotID);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }



}
