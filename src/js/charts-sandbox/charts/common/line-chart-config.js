export default getChartConfig = function() {
    const chartConfig = {
                "cases": {
                    "episode": {
                    "chartName": "cagov-chart-dashboard-confirmed-cases",
                    "latestField": "CONFIRMED_CASES",
                    "seriesField": "CONFIRMED_CASES_EPISODE_DATE",
                    "seriesFieldAvg": "AVG_CASE_RATE_PER_100K_7_DAYS",
                    "dataUrl": "confirmed-cases/california.json",
                    "dataUrlCounty": "confirmed-cases/<county>.json",
                    "rootId": "cases-ep"
                    },
                    "reported": {
                    "chartName": "cagov-chart-dashboard-confirmed-cases",
                    "latestField": "CONFIRMED_CASES",
                    "seriesField": "CONFIRMED_CASES_REPORTED_DATE",
                    "seriesFieldAvg": "AVG_CASE_REPORT_RATE_PER_100K_7_DAYS",
                    "dataUrl": "confirmed-cases/california.json",
                    "dataUrlCounty": "confirmed-cases/<county>.json",
                    "rootId": "cases-rep"
                    }
                },
                "deaths": {
                    "death": {
                    "chartName": "cagov-chart-dashboard-confirmed-deaths",
                    "latestField": "CONFIRMED_DEATHS",
                    "seriesField": "CONFIRMED_DEATHS_DEATH_DATE",
                    "seriesFieldAvg": "AVG_DEATH_RATE_PER_100K_7_DAYS",
                    "dataUrl": "confirmed-deaths/california.json",
                    "dataUrlCounty": "confirmed-deaths/<county>.json",
                    "rootId": "death-date"
                    },
                    "reported": {
                    "chartName": "cagov-chart-dashboard-confirmed-deaths",
                    "latestField": "CONFIRMED_DEATHS",
                    "seriesField": "CONFIRMED_DEATHS_REPORTED_DATE",
                    "seriesFieldAvg": "AVG_DEATH_REPORT_RATE_PER_100K_7_DAYS",
                    "dataUrl": "confirmed-deaths/california.json",
                    "dataUrlCounty": "confirmed-deaths/<county>.json",
                    "rootId": "deaths-reported-date"
                    }
                },
                "tests": {
                    "testing": {
                    "chartName": "cagov-chart-dashboard-total-tests",
                    "latestField": "TOTAL_TESTS",
                    "seriesField": "TOTAL_TESTS",
                    "seriesFieldAvg": "AVG_TEST_RATE_PER_100K_7_DAYS",
                    "dataUrl": "total-tests/california.json",
                    "dataUrlCounty": "total-tests/<county>.json",
                    "rootId": "tests-tests"
                    },
                    "reported": {
                    "chartName": "cagov-chart-dashboard-total-tests",
                    "latestField": "TOTAL_TESTS",
                    "seriesField": "REPORTED_TESTS",
                    "seriesFieldAvg": "AVG_TEST_REPORT_RATE_PER_100K_7_DAYS",
                    "dataUrl": "total-tests/california.json",
                    "dataUrlCounty": "total-tests/<county>.json",
                    "rootId": "tests-rep"
                    }
                },
                "positivity": {
                    "positivity": {
                    "chartName": "cagov-chart-dashboard-positivity-rate",
                    "latestField": "POSITIVITY_RATE",
                    "seriesField": "TOTAL_TESTS",
                    "seriesFieldAvg": "TEST_POSITIVITY_RATE_7_DAYS",
                    "dataUrl": "positivity-rate/california.json",
                    "dataUrlCounty": "positivity-rate/<county>.json",
                    "rootId": "pos-rate"
                    }
                },
                "patients": {
                    "hospitalized": {
                    "chartName": "cagov-chart-dashboard-patients",
                    "latestField": "HOSPITALIZED_PATIENTS",
                    "seriesField": "HOSPITALIZED_PATIENTS",
                    "seriesFieldAvg": "HOSPITALIZED_PATIENTS_14_DAY_AVG",
                    "dataUrl": "patients/california.json",
                    "dataUrlCounty": "patients/<county>.json",
                    "rootId": "hosp-p"
                    },
                    "icu": {
                    "chartName": "cagov-chart-dashboard-patients",
                    "latestField": "ICU_PATIENTS",
                    "seriesField": "ICU_PATIENTS",
                    "seriesFieldAvg": "ICU_PATIENTS_14_DAY_AVG",
                    "dataUrl": "patients/california.json",
                    "dataUrlCounty": "patients/<county>.json",
                    "rootId": "hosp-p"
                    }
                },
                "desktop": {
                    "fontSize": 14,
                    "width": 400,    
                    "height": 300,
                    "margin": {   
                    "left": 50,   
                    "top": 30,  
                    "right": 60,  
                    "bottom": 45
                    }
                },
                "tablet": {
                    "fontSize": 14,
                    "width": 400,     
                    "height": 300,
                    "margin": {   
                    "left": 50,   
                    "top": 30,  
                    "right": 60,  
                    "bottom": 45
                    }
                },
                "mobile": {
                    "fontSize": 12,
                    "width": 400,     
                    "height": 300,
                    "margin": {   
                    "left": 50,   
                    "top": 30,  
                    "right": 60,  
                    "bottom": 45
                    }
                },
                "retina": {
                    "fontSize": 12,
                    "width": 400,     
                    "height": 300,
                    "margin": {   
                    "left": 50,   
                    "top": 30,  
                    "right": 60,  
                    "bottom": 45
                    }
                }
        };
    return chartConfig;
}
