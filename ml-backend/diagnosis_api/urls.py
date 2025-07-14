from django.urls import path
from .views import ReportUploadView, TBReportUploadView

urlpatterns = [
    path('upload/', ReportUploadView.as_view(), name='report-upload'),
    path('tb/upload/', TBReportUploadView.as_view(), name='tb-report-upload'),
] 