from django.test.simple import DjangoTestSuiteRunner
from django.conf import settings


class IncludeAppsTestSuiteRunner(DjangoTestSuiteRunner):
    """ Override the default django 'test' command, to include only PROJECT_APPS for testing
    """

    def run_tests(self, test_labels, extra_tests=None, **kwargs):
        if not test_labels:
            test_labels = settings.PROJECT_APPS
        return super(IncludeAppsTestSuiteRunner, self).run_tests(
            test_labels, extra_tests, **kwargs)
