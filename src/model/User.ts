class User {
    id: number;
    last_name: string;
    first_name: string;
    email: string;
    password: string;
  
    constructor(id: number, last_name: string, first_name: string, email: string, password: string) {
      this.id = id;
      this.last_name = last_name;
      this.first_name = first_name;
      this.email = email;
      this.password = password;
    }
  
    static fromDatabaseResult(result: any): User {
      return new User(
        result.id,
        result.last_name,
        result.first_name,
        result.email,
        result.password
      );
    }
  }
  
  export default User;
  