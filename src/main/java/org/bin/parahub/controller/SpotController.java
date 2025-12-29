package org.bin.parahub.controller;


import jakarta.validation.Valid;
import org.bin.parahub.annotation.Profiled;
import org.bin.parahub.dto.SpotDTO;
import org.bin.parahub.service.SpotService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/spots")
@Profiled(logArgs = true, logResult = false)
public class SpotController {

    private final SpotService spotService;


    public SpotController(SpotService spotService) {
        this.spotService = spotService;
    }

    @GetMapping
    public ResponseEntity<List<SpotDTO>> getSpots() {
        List<SpotDTO> spots = spotService.getAllSpots();

        return ResponseEntity.status(HttpStatus.OK).body(spots);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<SpotDTO> getSpotById(@PathVariable Long id) {
        SpotDTO spotDTO = spotService.getSpotById(id);

        return ResponseEntity.status(HttpStatus.OK).body(spotDTO);
    }
    @GetMapping("/name/{name}")
    public ResponseEntity<List<SpotDTO>> getSpotByName(@PathVariable String name) {
        List<SpotDTO> spotDTO = spotService.getSpotByName(name);

        return ResponseEntity.status(HttpStatus.OK).body(spotDTO);
    }

    @GetMapping("/search")
    public ResponseEntity<List<SpotDTO>> searchSpotsByName(@RequestParam("name") String name) {
        List<SpotDTO> spots = spotService.getAllSpotsContainingName(name);

        return ResponseEntity.status(HttpStatus.OK).body(spots);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SpotDTO> createSpot(@Valid @RequestBody SpotDTO spot) {
        SpotDTO savedSpotDTO = spotService.save(spot);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSpotDTO);
    }

    @PutMapping("/id/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SpotDTO> updateSpot(@PathVariable long id,@Valid @RequestBody SpotDTO spotDTO) {
        SpotDTO updatedSpotDTO = spotService.updateSpot(id, spotDTO);
        return ResponseEntity.status(HttpStatus.OK).body(updatedSpotDTO);
    }

    @DeleteMapping("/id/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSpot(@PathVariable long id) {
        spotService.deleteSpotById(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
