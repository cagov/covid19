export default function getCounties () {
  const counties = [
    {
      name: 'Modoc',
      url: 'https://public.coderedweb.com/CNE/en-US/BFB9C8502454'
    },
    {
      name: 'Siskiyou',
      url:
        'https://www.co.siskiyou.ca.us/emergencyservices/page/codered-emergency-alert-system'
    },
    {
      name: 'Del Norte',
      url: 'http://www.co.del-norte.ca.us/news/delnortecommunityalertsystem'
    },
    {
      name: 'Humboldt',
      url: 'https://humboldtgov.org/2014/Emergency-Notifications'
    },
    {
      name: 'Trinity',
      url: 'https://www.trinitycounty.org/oes/codered'
    },
    {
      name: 'Shasta',
      url: 'https://public.coderedweb.com/CNE/en-US/BFBDCA5E730B'
    },
    {
      name: 'Lassen',
      url: 'https://public.coderedweb.com/CNE/en-US/BFB7CC4C6C0A'
    },
    {
      name: 'Mendocino',
      url: 'https://www.mendocinocounty.org/MendoAlert'
    },
    {
      name: 'Tehama',
      url: 'https://member.everbridge.net/index/892807736723620#/signup'
    },
    {
      name: 'Plumas',
      url: 'https://www.plumascounty.us/2163/CodeRed-Emergency-Alert-System'
    },
    {
      name: 'Lake',
      url: 'http://www.lakesheriff.com/About/OES/LakeCoAlerts.htm'
    },
    {
      name: 'Colusa',
      url: 'https://www.countyofcolusa.org/index.aspx?NID=64'
    },
    {
      name: 'Glenn',
      url: 'https://www.smart911.com/'
    },
    {
      name: 'Butte',
      url: 'https://public.coderedweb.com/CNE/en-US/BFA19C579EA5'
    },
    {
      name: 'Yuba',
      url: 'https://public.coderedweb.com/CNE/en-US/FBE5B4D6F361'
    },
    {
      name: 'Sierra',
      url: 'http://www.sierracounty.ca.gov/224/CodeRED'
    },
    {
      name: 'Nevada',
      url: 'https://public.coderedweb.com/CNE/en-US/CA8B57E20D17'
    },
    {
      name: 'Alameda',
      url: 'http://www.acgov.org/emergencysite/'
    },
    {
      name: 'Alpine',
      url: 'https://douglascounty.onthealert.com/'
    },
    {
      name: 'Amador',
      url: 'https://www.amadorgov.org/departments/office-of-emergency-services/'
    },
    {
      name: 'Contra Costa',
      url: 'https://Cwsalerts.com'
    },
    {
      name: 'Fresno',
      url: 'https://member.everbridge.net/index/453003085614497#/login'
    },
    {
      name: 'Los Angeles',
      url: 'https://www.lacounty.gov/emergency/alert-la/'
    },
    {
      name: 'Merced',
      url: 'https://member.everbridge.net/index/1332612387831920#/login'
    },
    {
      name: 'San Mateo',
      url: 'https://member.everbridge.net/index/892807736723485#/login'
    },
    {
      name: 'Santa Clara',
      url: 'https://www.sccgov.org/sites/oes/about-us/pages/about_oes.aspx'
    },
    {
      name: 'Mono',
      url: 'https://public.coderedweb.com/CNE/en-US/09531DC35832'
    },
    {
      name: 'Napa',
      url: 'https://local.nixle.com/city/ca/napa/'
    },
    {
      name: 'Orange',
      url: 'https://member.everbridge.net/index/453003085613900#/login'
    },
    {
      name: 'San Benito',
      url: 'https://public.coderedweb.com/CNE/en-US/218A80E36F49'
    },
    {
      name: 'San Diego',
      url: 'https://www.sandiegocounty.gov/coronavirus.html'
    },
    {
      name: 'San Luis Obispo',
      url: 'https://www.prepareslo.org/en/alert-and-notification-systems.aspx'
    },
    {
      name: 'Santa Barbara',
      url: 'https://member.everbridge.net/index/892807736723794#/signup'
    },
    {
      name: 'Sonoma',
      url: 'http://sonomacounty.ca.gov/FES/Emergency-Management/SoCoAlert/'
    },
    {
      name: 'Sutter',
      url: 'http://public.coderedweb.com/cne/en-US/bf0634786D76'
    },
    {
      name: 'Tulare',
      url:
        'https://oes.tularecounty.ca.gov/oes/index.cfm/preparedness/be-informed/stay-informed/'
    },
    {
      name: 'Yolo',
      url: 'https://www.yolocounty.org/residents/emergency-alerts-health-alerts'
    },
    {
      name: 'Madera',
      url: 'https://member.everbridge.net/index/892807736729447#/login'
    },
    {
      name: 'Calaveras',
      url: 'http://oes.calaverasgov.us/Notifications'
    },
    {
      name: 'Mariposa',
      url: 'https://member.everbridge.net/index/892807736729447#/login'
    },
    {
      name: 'Solano',
      url: 'http://www.alertsolano.com'
    },
    {
      name: 'Inyo',
      url: 'https://public.coderedweb.com/CNE/en-US/DAD807D480BF'
    },
    {
      name: 'Monterey',
      url: 'https://member.everbridge.net/index/453003085611217#/login'
    },
    {
      name: 'Stanislaus',
      url: 'http://stanaware.com/'
    },
    {
      name: 'Marin',
      url:
        'https://www.marinsheriff.org/services/emergency-services/alert-marin'
    },
    {
      name: 'San Joaquin',
      url: 'https://nixle.com/county/ca/san-joaquin/municipal/'
    },
    {
      name: 'Kings',
      url: 'https://www.countyofkings.com/departments/emergency-preparedness'
    },
    {
      name: 'San Francisco',
      url: 'https://member.everbridge.net/index/453003085612609#/login'
    },
    {
      name: 'Imperial',
      url: 'https://imperialcotens.onthealert.com/Terms/Index/?ReturnUrl=%2f'
    },
    {
      name: 'Placer',
      url: 'https://www.placer-alert.org'
    },
    {
      name: 'Tuolumne',
      url: 'https://www.tuolumnecounty.ca.gov/AlertCenter.aspx'
    },
    {
      name: 'Ventura',
      url: 'https://vcemergency.com'
    },
    {
      name: 'Santa Cruz',
      url: 'https://public.coderedweb.com/CNE/en-US/218A80E36F49'
    },
    {
      name: 'Kern',
      url: 'http://www.kerncountyfire.org/education/ready-kern.html'
    },
    {
      name: 'San Bernardino',
      url: 'https://www.sbcounty.gov/SBCFire/TENS/TENSContact.aspx'
    },
    {
      name: 'El Dorado',
      url: 'http://ready.edso.org/'
    },
    {
      name: 'Sacramento',
      url:
        'http://www.sacramentoready.org/Pages/Emergency-Alerts-Notification-System.aspx'
    },
    {
      name: 'Riverside',
      url: 'https://countyofriverside.us/Residents/Emergencies/AlertRivCo.aspx'
    }
  ];
  return counties;
}
