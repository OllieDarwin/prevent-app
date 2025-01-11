export interface Facility {
    id: string;
    name: string;
    rating: number;
    description: string;
    coordinates: [number, number];
    address: string;
    website: string;
    phone: string;
    doctors: string[];
}

export const facilities: Facility[] = [
    {
        id: "royal",
        name: "Royal Liverpool University Hospital",
        rating: 3.5,
        description: "",
        coordinates: [53.40867772428242, -2.9638728913488426],
        address: "Mount Vernon St, Liverpool L7 8YE",
        website: "https://www.rlbuht.nhs.uk/",
        phone: "0151 706 2000",
        doctors: [
            "HHI7p8Bc3ONQ3wv1lqkQrmdio7y1",
            "t3kbWVfX8VNqMZYBcpSbYExNLyx2"
        ]
    },
    {
        id: "broadgreen",
        name: "Broadgreen Hospital",
        rating: 4.4,
        description: "",
        coordinates: [53.41197642387106, -2.899036163166965],
        address: "Thomas Dr, Liverpool L14 3LB",
        website: "http://www.rlbuht.nhs.uk/",
        phone: "0151 706 2000",
        doctors: []
    },
    {
        id: "aintree",
        name: "Aintree University Hospital",
        rating: 3.8,
        description: "",
        coordinates: [53.46571094822194, -2.933279878001404],
        address: "Lower Ln, Fazakerley, Liverpool L9 7AL",
        website: "http://www.aintreehospital.nhs.uk/",
        phone: "0151 525 5980",
        doctors: []
    },
    {
        id: "liverpool-womens",
        name: "Liverpool Women's Hospital",
        rating: 3.5,
        description: "",
        coordinates: [53.39871591449954, -2.96015024306861],
        address: "Crown St, Liverpool L8 7SS",
        website: "http://www.liverpoolwomens.nhs.uk/",
        phone: "0151 708 9988",
        doctors: []
    },
    {
        id: "liverpool-heart-chest",
        name: "Liverpool Heart and Chest Hospital",
        rating: 4.8,
        description: "",
        coordinates: [53.408923641639376, -2.8996318026729373],
        address: "Thomas Dr, Liverpool L14 3PE",
        website: "http://www.lhch.nhs.uk/",
        phone: "0151 600 1616",
        doctors: []
    },
    {
        id: "spire",
        name: "Spire Liverpool Hospital",
        rating: 3.5,
        description: "",
        coordinates: [53.38742947718065, -2.9240077177903463],
        address: "57 Greenbank Rd, Liverpool L18 1HQ",
        website: "https://www.spirehealthcare.com/",
        phone: "0151 733 7123",
        doctors: []
    },
    {
        id: "whiston",
        name: "Whiston Hospital",
        rating: 3.6,
        description: "",
        coordinates: [53.421483188579565, -2.784073847777326],
        address: "Warrington Rd, Rainhill, Prescot L35 5DR",
        website: "https://www.sthk.nhs.uk/whiston-hospital",
        phone: "0151 426 1600",
        doctors: []
    }
]
