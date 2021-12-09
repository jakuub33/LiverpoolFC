const News = require('../db/models/news');
const fs = require('fs'); //biblioteka do czytania plików

class NewsController {

    async showNews(req, res) {
        /* q=searchBar
           sort=sortowanie
           counts=filtrowanie */
        const { q, sort, countmin, countmax } = req.query; //wyciągamy wartość ze sluga
        const page = req.query.page || 1; //jeśli nie podałem strony to aktualnie jest strona 1wsza
        const perPage = 4; //ile wyników na per strone chce wyswietlic

        // SZUKANIE ##########################################
        const where = {};
        // https://docs.mongodb.com/manual/reference/operator/query/regex/
        if (q) {
            where.name = { $regex: q , $options: 'i' }; //wyrażenie regularne, "i" nierozróżnia wielkości liter
        } 
        
        // // FILTROWANIE ##########################################
        // // https://docs.mongodb.com/manual/reference/operator/aggregation/
        // if (countmin || countmax) {
        //     where.employeesCount = {}; //jeśli została podana wartość to tworzę obiekt
        //     if (countmin) where.employeesCount.$gte = countmin; //gt=greater than, gte=większe lub równe
        //     if (countmax) where.employeesCount.$lte = countmax; //lte=mniejsze lub równe
        // }

        let query = News.find(where); //bez await, bo nie chce od razu szukać  
        

        // PAGINACJA ##########################################\
        query = query.skip((page - 1) * perPage);   //od ktorego miejsca ma pobrac reszte wyników
        query = query.limit(perPage);   //limit ile wyników na 1dną strone potrzebujesz

        // SORTOWANIE ##########################################
        if (sort) {
            //dzielimy parametr sort
            const s = sort.split('|');

            //funckcja mongoDB
            //asc - rosnąco, desc - malejąco
            //np name|asc to 0=name, a 1=asc
            query = query.sort({ [s[0]]: s[1] });
        }

        //uruchamiam moje query - z użytymi parametrami
        const news = await query.populate([
            //populate - dzięki temu, możemy odwołać się do konkretnego pola z kolekcji User, a nie samo id usera
            'author',
            'comments'
        ]).exec(); 
        
        const resultsCount = await News.find(where).countDocuments(); //ilość wszystkich firm
        const pagesCount = Math.ceil(resultsCount / perPage); // zaokrągla liczbe ilości stron

        // Przekazujemy wartości
        res.render('pages/news/news', {
            title: 'Wiadomości',
            news: news,
            page,   //która aktualnie jest strona
            pagesCount, 
            resultsCount    
        });
    }

    async showOneNews(req, res) {
        const { name } = req.params;        
    
        //wczytujemy dane z bd
        const oneNews = await News.findOne({ slug: name }).populate(['author', 'comments']);;
    
        //Widok company.ejs, { parametry, które chcesz przesłać }
        res.render('pages/news/one-news', { 
            oneNews,            
            title: oneNews?.mainTitle ?? 'Brak wyników'  //Wyświetl nazwe firmy lub gdy taka nie istnieje to "brak"
        });
    }

    showCreateNewsForm(req, res) {
        res.render('pages/news/create', {
            title: 'Nowa aktualność'
        });
    }

    //musi być async, bo bedziemy łaczyc sie z bd
    async createOneNews(req, res) {
        //zapisanie wpisanych danych do bd
        const oneNews = new News({
            mainTitle: req.body.mainTitle,            
            text: req.body.text,
            author: req.session.user._id, //przy tworzeniu ligi, przypisz lige do usera
        });

        // sprawdzenie czy dodawane jest nowe zdjęcie        
        if (req.file?.filename) {            
            oneNews.image = req.file.filename;
        }

        try {
            await oneNews.save();
            res.redirect('/wiadomosci');    //przekierowanie na jakis adres po zapisaniu            
        } catch (e) {
            console.log(e);
            //jeśli zostanie wyłapany błąd, to generujemy znowu tą stronę z formularzem i pokazujemy błędy
            res.render('pages/news/create', {
                title: 'Nowa aktualność',
                errors: e.errors,
                form: req.body //musimy przesłać dane z formularza
            });
        }
    }

    // EDYCJA
    async showEditNewsForm(req, res) {
        const { name } = req.params;
        const oneNews = await News.findOne({ slug: name });

        //potrzebujemy dane aktualności, więc przekazujemy je
        res.render('pages/news/edit', {
            title: 'Edycja',
            form: oneNews //użyjemy tego samego formularza
        });
    }

    //musi być async, bo bedziemy łaczyc sie z bd
    async editNews(req, res) {
        //pobieramy aktualność
        const { name } = req.params;
        const oneNews = await News.findOne({ slug: name });

        //podmieniamy pola w bd
        oneNews.mainTitle = req.body.mainTitle;
        oneNews.text = req.body.text;
        
        // sprawdzenie czy dodawane jest nowe zdjęcie i czy zdjecie juz istnieje
        if (req.file.filename && oneNews.image) {
            fs.unlinkSync('public/uploads/' + oneNews.image); //wskazujemy zdjecie do usuniecia        
        }
        if (req.file.filename) {            
            oneNews.image = req.file.filename;
        }

        try {
            await oneNews.save();
            res.redirect('/wiadomosci');    //przekierowanie na jakis adres po zapisaniu            
        } catch (e) {
            //jeśli zostanie wyłapany błąd, to generujemy znowu tą stronę z formularzem i pokazujemy błędy
            res.render('pages/companies/edit', {
                title: 'Edycja',
                errors: e.errors,
                form: req.body //musimy przesłać dane z formularza
            });
        }
    }

    async deleteNews(req, res) {
        const { name } = req.params;
        const oneNews = await News.findOne({ slug: name });

        try {
            //jeśli istnieje zdjecie to je usun
            if (oneNews.image) {
                fs.unlinkSync('public/uploads/' + oneNews.image); //wskazujemy zdjecie do usuniecia        
            }

            await News.deleteOne({ slug: name });
            res.redirect('/wiadomosci');    //przekierowanie na jakis adres po zapisaniu  
        } catch (e) {
            //błędy nieprzewidziane
        }
    }

    async deleteImage(req, res) {
        const { name } = req.params;
        const oneNews = await News.findOne({ slug: name }); //pobieramy bieżącą firme

        try {
            fs.unlinkSync('public/uploads/' + oneNews.image); //wskazujemy zdjecie do usuniecia
            oneNews.image = ''; //zresetuje wartosc image, zeby byla pusta
            await oneNews.save();

            res.redirect('/wiadomosci');    //przekierowanie na jakis adres po zapisaniu  
        } catch (e) {
            //błędy nieprzewidziane
        }
    }    
}

module.exports = new NewsController();