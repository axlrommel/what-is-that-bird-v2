package com.villagomezdiaz.common.results;

import com.villagomezdiaz.common.ImageCorrelation;

public class JedisCorrelationResults {
	
	private FilterType filterType;
	private String filterName;
	
	
	public JedisCorrelationResults(FilterType type, String filterName) {
		super();
		this.setFilterType(type);
		this.filterName = filterName;
	}

	public String getFilterName() {
		return filterName;
	}

	public void setFilterName(String filterName) {
		this.filterName = filterName;
	}

	public double getCorrelation(ImageCorrelation corr) {
		return filterType.getCorrelation(corr);
	}

	public FilterType getFilterType() {
		return filterType;
	}

	public void setFilterType(FilterType filterType) {
		this.filterType = filterType;
	}
	
	public String getClientFilterName() {
		return filterType.getClientFilterName();
	}
	

}
