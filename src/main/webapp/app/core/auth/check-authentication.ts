import { AccountService } from './account.service';

const accountService = new AccountService();

console.log('Is Authenticated:', accountService.isAuthenticated());
console.log('User Identity:', accountService.trackCurrentAccount());
