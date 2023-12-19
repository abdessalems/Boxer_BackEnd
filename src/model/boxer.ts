class Boxer {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    height: string;
    weight: string;
    fightNumber: string;
    win: string;
    losses: string;
    kos: string;
    gymNumber: string;
    title: string;
    imageLink: string;
    trainerName: string;

    constructor(
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        height: string,
        weight: string,
        fightNumber: string,
        win: string,
        losses: string,
        kos: string,
        gymNumber: string,
        title: string,
        imageLink: string,
        trainerName: string
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.height = height;
        this.weight = weight;
        this.fightNumber = fightNumber;
        this.win = win;
        this.losses = losses;
        this.kos = kos;
        this.gymNumber = gymNumber;
        this.title = title;
        this.imageLink = imageLink;
        this.trainerName = trainerName;
    }
}