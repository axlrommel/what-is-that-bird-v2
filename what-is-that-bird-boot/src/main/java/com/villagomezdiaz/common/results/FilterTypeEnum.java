package com.villagomezdiaz.common.results;

public enum FilterTypeEnum {

	RED(0,"red"),
	GREEN(1,"green"),
	BLUE(2,"blue"),
	CYAN(3,"cyan"),
	MAGENTA(4,"magenta"),
	YELLOW(5,"yellow"),
	RGB(6,"three color"),
	LOW(7,"dark gray"),
	HIGH(8,"light gray");
	
	private final int type;
	private final String fName;
	
	FilterTypeEnum(int type, String fName) {
		this.type = type;
		this.fName = fName;
	}

	public int getType() {
		return type;
	}

	public String getfName() {
		return fName;
	}
	
	
}
