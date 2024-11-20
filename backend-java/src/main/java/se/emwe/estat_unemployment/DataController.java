package se.emwe.estat_unemployment;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import se.emwe.estat_unemployment.dto.CountryData;
import se.emwe.estat_unemployment.dto.UnemploymentData;

import java.util.ArrayList;

@CrossOrigin
@Controller
@RequestMapping("/")
public class DataController {

    private final DataService dataService;

    public DataController(DataService dataService) {
        this.dataService = dataService;
    }



    @GetMapping({"/get-iso-codes"})
    public ResponseEntity<ArrayList<CountryData>> getIsoCodes() {

        ArrayList<CountryData> countryData = dataService.getCountryDataList();

        if (countryData == null) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(countryData, HttpStatus.OK);

    }

    @GetMapping({"/get-data"})
    public ResponseEntity<ArrayList<UnemploymentData>> getData(@RequestParam String iso_code) {

        ArrayList<UnemploymentData> unemploymentData = dataService.getUnemploymentData(iso_code);
        if (unemploymentData == null) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(unemploymentData, HttpStatus.OK);
    }


}
