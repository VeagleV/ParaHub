package org.bin.parahub.enums;

public enum WindDirection {
    N("Север", "↑"),
    NE("Северо-Восток", "↗"),
    E("Восток", "→"),
    SE("Юго-Восток", "↘"),
    S("Юг", "↓"),
    SW("Юго-Запад", "↙"),
    W("Запад", "←"),
    NW("Северо-Запад", "↖");
    
    private final String label;
    private final String arrow;
    
    WindDirection(String label, String arrow) {
        this.label = label;
        this.arrow = arrow;
    }
    
    public String getLabel() {
        return label;
    }
    
    public String getArrow() {
        return arrow;
    }
}
