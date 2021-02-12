import json, argparse, math, random

sample_fields = {
    "REGION":"California",
    "REPORT_DATE":"02-03-2021"
}

default_start_population = 78668

file_layouts = [
    {
        "filename":"vaccines_by_race_ethnicity_california.json",
        "categories":["American Indian or Alaska Native (AI/AN)","Asian American","Black","Multi-race","Latino","Native Hawaiian or Other Pacific Islander (NHPI)","White","Other","Unknown"],
        "start_population":default_start_population,
        "ranked":False,
        "percents":True,
        "record_layout":["CATEGORY","METRIC_VALUE"],
    },
    {
        "filename":"vaccines_by_gender_california.json",
        "categories":["Female","Male","Unknown/undifferentiated"],
        "ranked":True,
        "percents":True,
        "start_population":default_start_population,
        "record_layout":["CATEGORY","METRIC_VALUE"],
        # "record_layout":["CATEGORY","METRIC_VALUE","BASELINE_VALUE"],
    },
    {
        "filename":"vaccines_by_age_california.json",
        "categories":["0-17", "18-49","50-64", "65+","Unknown"],
        "ranked":False,
        "percents":True,
        "start_population":default_start_population,
        "record_layout":["CATEGORY","METRIC_VALUE"],
        # "record_layout":["CATEGORY","METRIC_VALUE","BASELINE_VALUE"],
    },
    {
        "filename":"vaccines_by_race_ethnicity_and_age_california.json",
        "categories":["American Indian or Alaska Native (AI/AN)","Asian American","Black","Multi-race","Latino","Native Hawaiian or Other Pacific Islander (NHPI)","White","Other","Unknown"],
        "subcats":["0-17", "18-49","50-64", "65+","Unknown"],
        "start_population":default_start_population,
        "ranked":True,
        "two_axis":True,
        "percents":False,
        "record_layout":["CATEGORY","SUBCAT","METRIC_VALUE"],
        # "record_layout":["REGION","REPORT_DATE","CATEGORY","SUBCAT","METRIC_VALUE"],
    },
]

descent_scale = 0.61

for frec in file_layouts:
    f_values = []
    f_cats = list(frec['categories'])
    pop = frec['start_population'] + random.randrange(50)
    for cat in frec['categories']:
        value = int(pop*descent_scale + random.randrange(50))
        f_values.append(value)
        pop = value
    if not frec['ranked']:
        random.shuffle(f_values)
    f_records = []
    print(f_values)
    if frec['percents']:
        tot_pop = sum(f_values)
        f_values = [v/float(tot_pop) for v in f_values]
    for ci,cat in enumerate(frec['categories']):
        if 'two_axis' in frec and frec['two_axis']:
            f_values2 = []
            pop2 = f_values[ci]+random.randrange(100)
            for subcat in frec['subcats']:
                value = int(pop2*descent_scale + random.randrange(50))
                f_values2.append(value)
                pop2 = value
            random.shuffle(f_values2)  
            for ci2,subcat in enumerate(frec['subcats']):
                record = {}
                for key in frec["record_layout"]:
                    if key in sample_fields:
                        value = sample_fields[key]
                    elif key == "CATEGORY":
                        value = cat
                    elif key == "SUBCAT":
                        value = subcat
                    elif key == "METRIC_VALUE":
                        value = f_values2[ci2]
                    elif key == "BASELINE_VALUE":
                        value = f_values2[ci2]*(1.0+(random.random()*.5-0.25))
                    else:
                        print("Unknown field",key)
                    record[key] = value
                f_records.append(record)
        else:
            record = {}
            for key in frec["record_layout"]:
                if key in sample_fields:
                    value = sample_fields[key]
                elif key == "CATEGORY":
                    value = cat
                elif key == "METRIC_VALUE":
                    value = f_values[ci]
                elif key == "BASELINE_VALUE":
                    value = f_values[ci]*(1.0+(random.random()*.5-0.25))
                else:
                    print("Unknown field",key)
                record[key] = value
            f_records.append(record)
    with open(frec["filename"],"w") as ofile:
        json.dump(f_records, ofile,indent=4)
    print("Wrote",frec["filename"])
  
