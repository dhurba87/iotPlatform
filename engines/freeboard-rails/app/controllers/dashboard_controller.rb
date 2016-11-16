class DashboardController < ApplicationController
  before_action :dashboard_params, only: [:create]
  before_action :authenticate_user!, except: [:show]
  before_action :set_dashboard, only: [:destroy]

  def index
    @dashboards = Dashboard.where(user: current_user).reverse
    @dashboard = Dashboard.new
  end

  def create
    @dashboard = Dashboard.new(dashboard_params)
    @dashboard[:user] = current_user
    if @dashboard.save
      redirect_to :dashboard_index, notice: 'Dashboard was successfully created.'
    else
      redirect_to :dashboard_index, alert: (@dashboard.errors ? @dashboard.errors.full_messages.first : 'Error occurred' )
    end
  end

  def show
    @dashboard = Dashboard.find(params[:id])
    # check visibility of dashboard
    if @dashboard.visibility.to_s == 'private'
      # user should be logged in and associated with params id
      authenticate_user!
      set_dashboard
    end
    render :layout => false
  end

  def destroy
    @dashboard.destroy
    redirect_to :dashboard_index, notice: 'Dashboard was successfully destroyed.'
  end

  private
  def dashboard_params
    params.require(:dashboard).permit(:name, :visibility)
  end

  def set_dashboard
    @dashboard = Dashboard.where({user: current_user, id: params[:id]})
  end
end
