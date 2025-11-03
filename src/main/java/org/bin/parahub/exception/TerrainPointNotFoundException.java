package org.bin.parahub.exception;

public class TerrainPointNotFoundException extends RuntimeException {
    public TerrainPointNotFoundException(String message) {
        super(message);
    }

    public TerrainPointNotFoundException(Long id) {
        super("Could not find terrain point with id " + id);
    }
}
