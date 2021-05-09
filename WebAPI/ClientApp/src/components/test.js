import React from "react";
import GridTable from '@nadavshaar/react-grid-table';

//Servis Hizmetlerini Db'den çekme
let processes = [];

function getProcesses() {
    let token = localStorage.getItem('token');

    let url = "/api/processes/getprocessdetails";
    fetch(url, {
        method: 'get',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(async (response) => {
            const data = await response.json();

            if (!response.ok) {
                const error = data[0];
                return Promise.reject(error);
            }

            processes = data;
            
            processes.forEach(element => {
                element.startingDate = element.startingDate.replace('T', ' ');
            });

        })
        .catch((responseError) => {
            if (responseError.Message == "Token Bulunamadı!") {
                this.CreateTokenByRefreshToken();
            }
        })
};

getProcesses();

const MyAwesomeTable = () => {

    const columns = [
        {
            id: 1,
            field: 'customerName',
            label: 'Müşteri',
        },
        {
            id: 2,
            field: 'bicycle',
            label: 'Bisiklet',
        },
        {
            id: 3,
            field: 'employeeName',
            label: 'Personel',
        },
        {
            id: 4,
            field: 'startingDate',
            label: 'Başlangıç Tarihi',
        },
        {
            id: 5,
            field: 'competitionDate',
            label: 'Öngörülen Teslim Tarihi',
        },
        {
            id: 6,
            field: 'status',
            label: 'Durum',
        }
    ];
    
    return (
        <GridTable
            columns={columns}
            rows={processes}
        />
    )
};

export default MyAwesomeTable;

