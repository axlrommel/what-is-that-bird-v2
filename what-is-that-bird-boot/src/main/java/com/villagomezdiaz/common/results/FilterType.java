package com.villagomezdiaz.common.results;

import com.villagomezdiaz.common.ImageCorrelation;

public class FilterType {

	private FilterTypeEnum type;
		
	public FilterType(FilterTypeEnum t) {
		this.type = t;
	}
	
	public FilterTypeEnum getTyp() {
		return type;
	}
	
	public String getClientFilterName() {
		return type.getfName();
	}
	
	public double getCorrelation(ImageCorrelation corr) {
		
		FilterTypeEnum typ = this.type;
		double retval = 0;
		switch(typ) {
			case RED:
				retval = corr.getRedColorCorrelation();
				break;
			case GREEN:
				retval = corr.getGreenColorCorrelation();
				break;
			case BLUE:
				retval = corr.getBlueColorCorrelation();
				break;
			case CYAN:
				retval = corr.getCyanColorCorrelation();
				break;
			case MAGENTA:
				retval = corr.getMagentaColorCorrelation();
				break;
			case YELLOW:
				retval = corr.getYellowColorCorrelation();
				break;
			case RGB:
				retval = corr.getThreeColorCorrelation();
				break;
			case HIGH:
				retval = corr.getHighColorCorrelation();
				break;
			case LOW:
				retval = corr.getLowColorCorrelation();
				break;
			default:
				break;
		}
		return retval;
			
	}
}
