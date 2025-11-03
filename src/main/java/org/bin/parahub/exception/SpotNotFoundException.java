package org.bin.parahub.exception;

public class SpotNotFoundException extends RuntimeException {

    public SpotNotFoundException(Long id) { super("Spot with id " + id + " not found"); }

    public SpotNotFoundException(String name) { super("Spot with name " + name + " not found"); }
}
