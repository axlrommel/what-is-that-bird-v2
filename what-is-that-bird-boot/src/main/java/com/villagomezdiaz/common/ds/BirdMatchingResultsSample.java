package com.villagomezdiaz.common.ds;

import java.util.HashSet;
import java.util.Set;

public class BirdMatchingResultsSample {

	
	public static BirdMatchingResults getBirdMatchingResultsSample() {
		
		BirdMatchingResults sampleResults = new BirdMatchingResults();
		sampleResults.setNumBirds(2000);
		sampleResults.setNumSpecies(200);
		Set<BirdsResults> bResults = new HashSet<BirdsResults>();
		bResults.add(getBirdResultsSample());
		sampleResults.setbResults(bResults);
		
		return sampleResults;
	}
	
	
	private static BirdsResults getBirdResultsSample() {
		BirdsResults bResults = new BirdsResults();
		bResults.setBirdName("cardinal");
		bResults.setOverallScore(0.66);
		bResults.setPath("017.Cardinal/Cardinal_0001_17057.jpg");
		Set<FilterResults> r = new HashSet<FilterResults>();
		r.add(getFilterResultsSample());
		bResults.setfResults(r);
		return bResults;
	}
	
	private static FilterResults getFilterResultsSample() {
		FilterResults filter = new FilterResults();
		filter.setFilter("red filter");
		filter.setResult(0.66);		
		return filter;
	}
}
