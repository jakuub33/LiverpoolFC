// PAGINACJA
/* Funkcja, która dokleja do aktualnego adresu paginacje
    Jeśli zmieniam sortowanie/filtrowanie/szukam nowej wartości to
    paginacja się restartuje i usuwa wszystkie parametry/wyrzuca część "page=1" */
    const changePage = e => {
        e.preventDefault(); //usuwa domyślnie zachowanie linku (scrolluje automatycznie do góry i dodanie hasha w slug)
        
        //Trzeba podmienić slug i dodać do niego aktualną cyfrę strony na ktorej sie znajduje
        const search = new URLSearchParams(window.location.search); //pobieram aktualny slug
        search.set('page', e.target.dataset.page); //podmieniam aktualny slug
        
        // to cały link/slug
        const url = window.location.origin + //origin to localhost:3000
            window.location.pathname + '?' + //pathname to /ligi
            search.toString(); 

        window.location.href = url; //przekierowanie na nowy adres/link
    }

    // listener - pobieramy wszystkie strony (linki)
    document.querySelectorAll('.pagination a').forEach(a => {
        a.addEventListener('click', changePage);
    });