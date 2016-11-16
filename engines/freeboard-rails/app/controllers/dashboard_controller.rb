class DashboardController < ApplicationController
  before_action :dashboard_params, only: [:create]
  before_action :authenticate_user!

  def index
    @dashboards = Dashboard.where(user: current_user).reverse
    ap @dashboards
    @dashboard = Dashboard.new
  end

  def create
    @dashboard = Dashboard.new(dashboard_params)
    @dashboard[:user] = current_user
    if @dashboard.save
      redirect_to :dashboards, notice: 'Dashboard was successfully created.'
    else
      redirect_to :dashboards, alert: (@dashboard.errors ? @dashboard.errors.full_messages.first : 'Error occurred' )
    end
  end

  def board
    render :layout => false
  end

  private
  def dashboard_params
    params.require(:dashboard).permit(:name, :visibility)
  end
end
