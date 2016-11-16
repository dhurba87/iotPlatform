Rails.application.routes.draw do
  get 'dashboard/index', as: 'dashboards'
  post 'dashboard/create'
  get 'dashboard/board/:id', to: 'dashboard#board', as: 'dashboard'
end
