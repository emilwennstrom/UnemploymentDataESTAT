package se.emwe.estat_unemployment;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.guava.GuavaModule;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.google.common.collect.ImmutableMap;
import no.ssb.jsonstat.JsonStatModule;
import no.ssb.jsonstat.v2.Dataset;
import no.ssb.jsonstat.v2.DatasetBuildable;
import no.ssb.jsonstat.v2.Dimension;
import org.springframework.stereotype.Service;
import se.emwe.estat_unemployment.dto.CountryData;
import se.emwe.estat_unemployment.dto.UnemploymentData;
import se.emwe.estat_unemployment.dto.UnemploymentDataComparator;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Service
public class DataService {

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private Dataset dataset = null;

    public DataService() {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JsonStatModule());
        this.objectMapper.registerModule(new GuavaModule());
        this.objectMapper.registerModule(new Jdk8Module());
        this.objectMapper.registerModule(new JavaTimeModule());

        this.objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        this.objectMapper.configure(DeserializationFeature.FAIL_ON_INVALID_SUBTYPE, false);

        fetchData();
    }

    private void fetchData() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(ESTAT.DATA_URL))
                    .timeout(Duration.ofSeconds(10))
                    .GET()
                    .build();

            System.out.println("Fetching data...");
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("Response Code: " + response.statusCode());

            String content = response.body().replaceAll(Pattern.quote("+0200"), "+02:00");

            if (response.statusCode() == 200) {
                DatasetBuildable datasetBuildable = objectMapper.readValue(content, DatasetBuildable.class);
                this.dataset = datasetBuildable.build();
                System.out.println("Dataset successfully loaded.");
            } else {
                System.err.println("Failed to fetch data. HTTP Status: " + response.statusCode());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public boolean notLoaded() {
        return dataset == null;
    }


    public ArrayList<CountryData> getCountryDataList() {
        if (notLoaded()) return null;

        ArrayList<CountryData> countryData = new ArrayList<>();

        Map<String, Dimension> dimensions = dataset.getDimension();
        ImmutableMap<String, String> geoLabels = dimensions.get("GEO").getCategory().getLabel();

        geoLabels.forEach((key, value) -> {
            if (!key.equals("EU27_2020") && !key.equals("EA19")) {
                countryData.add(new CountryData(key, value));
            }
        });

        return countryData;

    }


    public ArrayList<UnemploymentData> getUnemploymentData(String isoCode) {

        if (notLoaded()) return null;

        String[] genders = {"M", "F"};
        ArrayList<UnemploymentData> unemploymentData = new ArrayList<>();
        Map<List<String>, Number> dataMap = dataset.asMap();

        for (String gender : genders) {
            dataMap.entrySet().stream()
                    .filter(entry -> entry.getKey().get(2).equals("TOTAL"))     // 2 is the index for AGE
                    .filter(entry -> entry.getKey().get(3).equals(gender))         // 3 is the index for SEX
                    .filter(entry -> entry.getKey().get(4).equals("REG_UNE"))   // 4 is the index for REGIS_ES
                    .filter(entry -> entry.getKey().get(5).equals("TOT2_7"))    // 5 is the index for LMP_TYPE
                    .filter(entry -> entry.getKey().get(6).equals(isoCode))        // 6 is the index for GEO
                    .forEach(entry -> {
                        String sex = entry.getKey().get(3);
                        String timePeriod = entry.getKey().get(7);
                        Number value = entry.getValue();

                        unemploymentData.add(new UnemploymentData(sex, timePeriod, value));
                    });
        }

        unemploymentData.sort(new UnemploymentDataComparator());
        return unemploymentData;
    }
}
