Rails.application.routes.draw do
  resources :dashboard, except: [:new, :edit]
end
