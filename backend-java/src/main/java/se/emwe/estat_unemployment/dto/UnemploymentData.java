package se.emwe.estat_unemployment.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UnemploymentData(String sex, @JsonProperty("time_period") String timePeriod, Number value)  {
}

