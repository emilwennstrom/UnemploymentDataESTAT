package se.emwe.estat_unemployment.dto;

import java.util.Comparator;

public class UnemploymentDataComparator implements Comparator<UnemploymentData> {

    @Override
    public int compare(UnemploymentData o1, UnemploymentData o2) {
        int timeComparison = o1.timePeriod().compareTo(o2.timePeriod());
        if (timeComparison != 0) {
            return timeComparison;
        }
        return o1.sex().compareTo(o2.sex());
    }
}

