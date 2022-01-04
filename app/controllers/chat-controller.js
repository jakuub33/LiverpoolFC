const Chat = require('../db/models/chat');
const Message = require('../db/models/message');

class ChatController {

    async showChats(req, res) {
        /* q=searchBar
           sort=sortowanie
           counts=filtrowanie */
        const { q, sort } = req.query; //pobieram wartość ze sluga
        const page = req.query.page || 1; //jeśli nie podałem strony to aktualnie jest strona 1wsza
        const perPage = 2; //ile wyników na per strone chce wyswietlic

        // SZUKANIE ##########################################
        const where = {};
        // https://docs.mongodb.com/manual/reference/operator/query/regex/
        if (q) {
            where.nameChat = { $regex: q , $options: 'i' }; //wyrażenie regularne, "i" nierozróżnia wielkości liter
        }         

        let query = Chat.find(where); //bez await, bo nie chce od razu szukać  

        // PAGINACJA ##########################################
        query = query.skip((page - 1) * perPage);   //od ktorego miejsca ma pobrac reszte wyników
        query = query.limit(perPage);   //limit ile wyników na jedną strone potrzebujesz

        // // SORTOWANIE ##########################################
        // if (sort) {
        //     //dzielimy parametr sort
        //     const s = sort.split('|');

        //     //funckcja mongoDB
        //     //asc - rosnąco, desc - malejąco
        //     //np name|asc to 0=name, a 1=asc
        //     query = query.sort({ [s[0]]: s[1] });
        // }

        //uruchamiam moje query - z użytymi parametrami
        const chats = await query.populate([
            //populate - dzięki temu, możemy odwołać się do konkretnego pola z kolekcji User, a nie samo id usera
            'author',
            'messages'
        ]).exec(); 
        
        const resultsCount = await Chat.find(where).countDocuments(); //ilość wszystkich chatów
        const pagesCount = Math.ceil(resultsCount / perPage); //zaokrągla liczbe ilości stron

        // Przekazujemy wartości i wyswietlamy chaty
        res.render('pages/chats/chats', {
            title: 'Chat',
            chats,
            page,   //która aktualnie jest strona
            pagesCount, 
            resultsCount    
        });
    }

    //WYŚWIETLENIE KONKRETNEGO CHATU
    async showChat(req, res) {
        const { name } = req.params;        
    
        //wczytujemy dane z bd
        const chat = await Chat.findOne({ slug: name }).populate(['author', 'messages']);
    
        //Widok chat.ejs, { parametry, które chcesz przesłać }
        res.render('pages/chats/chat', { 
            chat,            
            title: chat?.nameChat ?? 'Brak wyników'  //Wyświetl nazwe, a gdy chat nie istnieje "brak"
        });
    }

    // DODANIE WIADOMOŚCI CHATU
    async messageButton(req, res) {
        const { name } = req.params;
        const chat = await Chat.findOne({ slug: name });

        let date = new Date(); //przypisanie aktualnej daty wysłania wiadomości

        const message = new Message({
            text: req.body.text,
            date: date,
            author: req.session.user.nick, //przypisanie komentarza do usera
        })
        
        try { 
            //Dodanie wiadomości do kolekcji Messages
            await message.save();
            
            //Dodanie wiadomości do tablicy obiektów wiadomości w kolekcji Chat
            chat.messages.push(message);
            await chat.save();
            
            res.redirect(`/chat/${name}`); 
        } catch (e) {            
            console.log(e);
        }
    }    

    showCreateChatForm(req, res) {
        res.render('pages/chats/create', {
            title: 'Nowy chat'
        });
    }

    // TWORZENIE NOWEGO CHATU
    async createChat(req, res) {
        //zapisanie wpisanych danych do bd
        const chat = new Chat({
            nameChat: req.body.nameChat,            
            slug: req.body.slug,   
            author: req.session.user._id, //przy tworzeniu ligi, przypisz lige do usera
        });

        try {
            await chat.save();
            res.redirect('/chat');    //przekierowanie po zapisaniu            
        } catch (e) {
            console.log(e);
            //jeśli zostanie wyłapany błąd, to generujemy znowu tą stronę z formularzem i pokazujemy błędy
            res.render('pages/chats/create', {
                title: 'Nowy chat',
                errors: e.errors,
                form: req.body //musimy przesłać dane z formularza
            });
        }
    }

    async showEditChatForm(req, res) {
        const { name } = req.params;
        const chat = await Chat.findOne({ slug: name });

        //potrzebujemy dane chatu, którego chcemy edytować, więc przekazujemy je
        res.render('pages/chats/edit', {
            title: 'Edycja',
            form: chat //użyjemy tego samego formularza
        });
    }

    // EDYCJA KONKRETNEJ AKTUALNOŚCI
    async editChat(req, res) {
        //pobieramy aktualność
        const { name } = req.params;
        const chat = await Chat.findOne({ slug: name });

        //podmieniamy pola w bd
        chat.nameChat = req.body.nameChat;
        chat.slug = req.body.slug;  

        try {
            await chat.save();
            res.redirect('/chat');    //przekierowanie po zapisaniu            
        } catch (e) {
            //jeśli zostanie wyłapany błąd, to generujemy znowu tą stronę z formularzem i pokazujemy błędy
            res.render('pages/chats/edit', {
                title: 'Edycja',
                errors: e.errors,
                form: req.body //musimy przesłać dane z formularza
            });
        }
    }

    // USUWANIE KONKRETNEGO CHATU
    async deleteChat(req, res) {
        const { name } = req.params;

        try {    
            await Chat.deleteOne({ slug: name }); //usuniecie chatu po slugu
            res.redirect('/chat');    //przekierowanie po zapisaniu  
        } catch (e) {
            //błędy nieprzewidziane
        }
    }    
}

module.exports = new ChatController();