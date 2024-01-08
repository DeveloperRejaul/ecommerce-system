const { Router } = require('express');
const { auth } = require('../../middleware/auth');
const passport = require('passport');
const router = Router();
const {
	createUser, getUsers, updateUser, deleteUser, getUser, loginUser, logoutUser, forgotPassword,
	newPassword, googleAuthSuccess, facebookAuthSuccess, githubAuthSuccess, codeVerification
} = require('./user.fn');


module.exports =  (params) => {
	
	router.post('/user/login',  loginUser(params));
	router.post('/user/signup', createUser(params));
	router.post('/user/logout', logoutUser(params));
	router.post('/user/forgot-password', forgotPassword(params));
	router.post('/user/code-check', codeVerification(params));
	router.post('/user/new-password', newPassword(params));
	
	
	// all user routes 
	router.get('/auth/user', auth, getUsers(params));
	router.get('/auth/user/:id', auth, getUser(params));
	router.put('/auth/user/:id', auth, updateUser(params));
	router.delete('/auth/user/:id', auth, deleteUser(params));
	
	
	
	// google auth routes 
	router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
	router.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/api/v-1/auth/google/success', failureRedirect: '/auth/user/login' }));
	router.get('/auth/google/success', googleAuthSuccess(params));
	
	
	// facebook auth routes
	router.get('/facebook', passport.authenticate('facebook'));
	router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/auth/user/login', successRedirect: '/auth/facebook/success' }));
	router.get('/facebook/success', facebookAuthSuccess(params));
	
	
	// github auth routes 
	router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
	router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/auth/user/login', successRedirect: '/auth/github/success' }));
	router.get('/github/success', githubAuthSuccess(params));
	
	
	return router;
};
